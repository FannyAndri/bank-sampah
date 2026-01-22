import { View, Text, StyleSheet, ScrollView, Dimensions, Image } from "react-native";
import { useState, useRef } from "react";
import { Button } from "react-native-paper";
import { colors, spacing, typography } from "../theme";

const { width } = Dimensions.get("window");

const onboardingData = [
  {
    id: 1,
    title: "Selamat Datang di\nBank Sampah Digital",
    description: "Kelola sampah Anda dengan mudah dan dapatkan manfaatnya",
    image: "🌱",
    color: colors.primary[500],
  },
  {
    id: 2,
    title: "Daur Ulang untuk\nMasa Depan Lebih Baik",
    description: "Setiap sampah yang Anda daur ulang membantu menjaga lingkungan dan mengurangi polusi",
    image: "♻️",
    color: colors.secondary[500],
  },
  {
    id: 3,
    title: "Dapatkan Manfaat\nDari Sampah Anda",
    description: "Tukar sampah Anda menjadi saldo yang bisa ditarik kapan saja",
    image: "💰",
    color: colors.primary[600],
  },
  {
    id: 4,
    title: "Mudah dan Praktis",
    description: "Transaksi cepat dengan QR Code, pantau saldo dan riwayat transaksi dengan mudah",
    image: "📱",
    color: colors.secondary[600],
  },
];

export default function OnboardingScreen({ onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {onboardingData.map((item, index) => (
          <View key={item.id} style={[styles.slide, { width }]}>
            <View style={[styles.slideContent, { backgroundColor: item.color }]}>
              <View style={styles.imageContainer}>
                <Text style={styles.imageEmoji}>{item.image}</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Indicators */}
      <View style={styles.indicators}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentIndex && styles.indicatorActive,
            ]}
          />
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.buttons}>
        {currentIndex < onboardingData.length - 1 ? (
          <>
            <Button
              mode="text"
              onPress={handleSkip}
              textColor={colors.text.secondary}
              style={styles.skipButton}
            >
              Lewati
            </Button>
            <Button
              mode="contained"
              onPress={handleNext}
              style={styles.nextButton}
              buttonColor={colors.primary[500]}
              textColor={colors.text.white}
              contentStyle={styles.buttonContent}
            >
              Lanjutkan
            </Button>
          </>
        ) : (
          <Button
            mode="contained"
            onPress={handleNext}
            style={styles.getStartedButton}
            buttonColor={colors.primary[500]}
            textColor={colors.text.white}
            contentStyle={styles.buttonContent}
          >
            Mulai Sekarang
          </Button>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  slide: {
    flex: 1,
  },
  slideContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  imageEmoji: {
    fontSize: 100,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.h2,
    color: colors.text.white,
    textAlign: "center",
    marginBottom: spacing.md,
    fontWeight: "bold",
    lineHeight: 36,
  },
  description: {
    ...typography.body1,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 24,
  },
  indicators: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border.default,
  },
  indicatorActive: {
    width: 24,
    backgroundColor: colors.primary[500],
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  skipButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
    borderRadius: 12,
  },
  getStartedButton: {
    flex: 1,
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
});
